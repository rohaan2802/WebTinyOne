from pathlib import Path
from playwright.sync_api import sync_playwright
import json
import os
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'tests'/'artifacts'
OUT.mkdir(exist_ok=True)
widths=[240,280,320,360,375,390,414,520,540,600,640,760,768,820,912,1000,1024,1280,1440,1920,2560,3840]
results={}
class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'

with sync_playwright() as p:
    browser=p.chromium.launch(channel=os.environ.get('BROWSER_CHANNEL','chrome'),headless=True)
    for repo in [ROOT.name]:
        page=browser.new_page()
        errors=[]
        page.on('pageerror',lambda e: errors.append(str(e)))
        page.on('response',lambda r: errors.append(f'{r.status} {r.url}') if r.status>=400 else None)
        checks=[]
        for width in widths:
            page.set_viewport_size({'width':width,'height':900 if width>600 else 740})
            page.goto(base,wait_until='networkidle')
            page.evaluate('document.fonts.ready')
            overflow=page.evaluate('''() => ({width:innerWidth,scroll:document.documentElement.scrollWidth,bad:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width && (r.right>innerWidth+1 || r.left< -1) && !e.matches('.skip-link')}).map(e=>e.tagName+'.'+e.className)})''')
            assert overflow['scroll']<=width+1, (repo,width,overflow)
            assert not overflow['bad'],(repo,width,overflow)
            assert page.locator('h1').count()==1
            broken=page.evaluate('''async()=>{const imgs=[...document.images];for(const i of imgs){i.loading='eager';}await Promise.all(imgs.map(i=>i.decode().catch(()=>{})));return imgs.filter(i=>!i.naturalWidth).map(i=>i.src)}''')
            assert not broken,(repo,broken)
            if width<=760:
                menu=page.get_by_role('button',name='Menu')
                assert not page.locator('#navigation').is_visible()
                menu.click()
                assert menu.get_attribute('aria-expanded')=='true'
                assert page.locator('#navigation').is_visible()
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                page.keyboard.press('Escape')
                assert menu.get_attribute('aria-expanded')=='false'
                assert menu.evaluate('(e)=>e===document.activeElement')
                menu.click()
                page.locator('#navigation a').first.click()
                assert menu.get_attribute('aria-expanded')=='false'
                assert page.evaluate('document.activeElement.id')=='features'
            if width in [320,390,768,1440]:
                page.evaluate('window.scrollTo(0,0)')
                page.wait_for_timeout(200)
                page.screenshot(path=str(OUT/f'{repo}-{width}.png'),full_page=True)
            checks.append(width)
        # Large text reflow simulates an enlarged default browser font.
        page.set_viewport_size({'width':320,'height':740})
        page.add_style_tag(content='html{font-size:200%}')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(repo,'200% text overflow')
        # Landscape, including a compact phone and tablet.
        for width,height in [(568,320),(844,390),(1024,768)]:
            page.set_viewport_size({'width':width,'height':height})
            page.goto(base)
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        if repo=='WebTinyOne':
            page.get_by_label('Full name',exact=True).fill('Responsive Test')
            page.get_by_label('Email address',exact=True).first.fill('test@example.com')
            page.get_by_label('Your message',exact=True).fill('Testing the demo form.')
            page.get_by_role('button',name='Preview message').click()
            assert 'does not send' in page.locator('.contact-form .form-status').inner_text()
            page.locator('#newsletter-email').fill('test@example.com')
            page.get_by_role('button',name='Preview signup').click()
            assert 'does not create' in page.locator('.newsletter .form-status').inner_text()
        page.emulate_media(reduced_motion='reduce')
        assert page.evaluate('getComputedStyle(document.documentElement).scrollBehavior')=='auto'
        assert not errors,(repo,errors)
        page.close()
        context=browser.new_context(java_script_enabled=False,viewport={'width':320,'height':740})
        nojs=context.new_page()
        nojs.goto(base)
        assert nojs.locator('#navigation').is_visible()
        assert nojs.evaluate('document.documentElement.scrollWidth<=innerWidth')
        if repo=='WebTinyOne':
            assert nojs.locator('button[type=submit]:enabled').count()==0
        context.close()
        results[repo]={'widths':checks,'landscape':True,'large_text':True,'no_js_navigation':True,'reduced_motion':True,'console_errors':errors}
    browser.close()
server.shutdown()
(OUT/'results.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
