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
        for theme,width in [(theme,width) for theme in ['dark','light'] for width in widths]:
            page.set_viewport_size({'width':width,'height':900 if width>600 else 740})
            page.goto(base,wait_until='networkidle')
            page.evaluate('(theme)=>document.documentElement.dataset.theme=theme',theme)
            page.evaluate('document.fonts.ready')
            overflow=page.evaluate('''() => ({width:innerWidth,scroll:document.documentElement.scrollWidth,bad:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width && (r.right>innerWidth+1 || r.left< -1) && !e.matches('.skip-link')}).map(e=>e.tagName+'.'+e.className)})''')
            assert overflow['scroll']<=width+1, (repo,width,overflow)
            assert not overflow['bad'],(repo,width,overflow)
            assert page.locator('h1').count()==1
            broken=page.evaluate('''async()=>{const imgs=[...document.images].filter(i=>!i.classList.contains('viewer-image'));for(const i of imgs){i.loading='eager';}await Promise.all(imgs.map(i=>i.decode().catch(()=>{})));return imgs.filter(i=>!i.naturalWidth).map(i=>i.src)}''')
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
                page.screenshot(path=str(OUT/f'{repo}-{theme}-{width}.png'),full_page=True)
            checks.append({'theme':theme,'width':width})
        # Large text reflow simulates an enlarged default browser font.
        page.set_viewport_size({'width':320,'height':740})
        page.add_style_tag(content='html{font-size:200%}')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(repo,'200% text overflow')
        # Landscape, including a compact phone and tablet.
        for width,height in [(568,320),(844,390),(1024,768)]:
            page.set_viewport_size({'width':width,'height':height})
            page.goto(base)
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        # Theme preference survives reloads, and both controls have useful labels.
        page.goto(base)
        assert page.locator('html').get_attribute('data-theme')=='dark'
        page.get_by_role('button',name='Use light theme').click()
        page.reload()
        assert page.locator('html').get_attribute('data-theme')=='light'
        page.get_by_role('button',name='Use dark theme').click()
        page.reload()
        assert page.locator('html').get_attribute('data-theme')=='dark'
        # Filters, lightbox navigation and focus restoration across sizes/orientations.
        for width,height in [(240,740),(320,740),(768,900),(1440,900),(568,320)]:
            page.set_viewport_size({'width':width,'height':height})
            page.locator('[data-filter]').nth(1).click()
            count=page.locator('.work-card:visible').count()
            assert 0<count<8
            assert page.locator('[data-filter]').nth(1).get_attribute('aria-pressed')=='true'
            assert f'Showing {count} of 8' in page.locator('.filter-status').inner_text()
            opener=page.locator('.work-card:visible [data-preview]').first
            opener.click()
            dialog=page.get_by_role('dialog')
            assert dialog.is_visible()
            assert page.locator('.viewer-close').evaluate('(e)=>e===document.activeElement')
            assert page.locator('#viewer-position').inner_text()==f'1 / {count}'
            page.keyboard.press('ArrowRight')
            assert page.locator('#viewer-position').inner_text()==f'2 / {count}'
            page.keyboard.press('ArrowLeft')
            assert page.locator('#viewer-position').inner_text()==f'1 / {count}'
            assert page.locator('.viewer-image').evaluate('(i)=>i.decode().then(()=>i.naturalWidth>0)')
            assert dialog.evaluate('(e)=>e.scrollWidth<=e.clientWidth'),(repo,width,'dialog overflow')
            # Native modal keeps Tab navigation inside the viewer.
            for _ in range(5):
                page.keyboard.press('Tab')
                assert page.evaluate("!!document.activeElement.closest('dialog')")
            page.keyboard.press('Escape')
            assert not dialog.is_visible()
            assert opener.evaluate('(e)=>e===document.activeElement')
            page.get_by_role('button',name='All',exact=True).click()
            assert page.locator('.work-card:visible').count()==8
        page.emulate_media(reduced_motion='reduce')
        page.locator('#work').scroll_into_view_if_needed()
        page.get_by_role('button',name='Back to top',exact=True).click()
        page.wait_for_function('window.scrollY===0')
        assert page.locator('.site-header .brand').evaluate('(e)=>e===document.activeElement')
        page.emulate_media(reduced_motion='no-preference')
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
        assert nojs.locator('html').get_attribute('data-theme')=='dark'
        assert not nojs.locator('.theme-toggle').is_visible()
        assert nojs.locator('.work-card').count()==8
        assert nojs.evaluate('document.documentElement.scrollWidth<=innerWidth')
        if repo=='WebTinyOne':
            assert nojs.locator('button[type=submit]:enabled').count()==0
        context.close()
        results[repo]={'widths':checks,'landscape':True,'large_text':True,'no_js_navigation':True,'reduced_motion':True,'console_errors':errors}
    browser.close()
server.shutdown()
(OUT/'results.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
