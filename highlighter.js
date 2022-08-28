if(
    (
        document.contentType.startsWith('text/') || 
        document.contentType.startsWith('application/')
    ) &&
    document.contentType !== 'text/html'
) loadEditor();

function loadEditor()
{
    document.body.style.cssText = `
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        width: 100vw;
        min-height: 100vh;
        background-color: #1e1e1e;
    `;

    const iframe = document.createElementNS('http://www.w3.org/1999/xhtml', 'iframe');
    iframe.setAttributeNS(null, 'src', chrome.runtime.getURL('/editor/editor.html'));
    iframe.setAttributeNS(null, 'style', 'border: none; width: 100%; height: 100vh; display: block;');
    document.body.append(iframe);
    
    
    if(document.contentType === 'application/json')
    {
        const preElem = document.querySelector('body > pre');
        const text = preElem.innerHTML;
        preElem.remove();

        try
        {
            console.log(`%c{%c "JSON Highlighter" %c}%c
    JSON is shown below!
    %c
    🖱️ right click the json
    📄 copy object
    ⌨️ type %cconst json =%c <PASTE_JSON_HERE>
    🪠 paste the json
    🎉 have fun messing with it!
    %c`
                , 
                'line-height: 1.5rem; color: #9cdcfe; margin: 0 auto; display: inline-block;', 
                'line-height: 1.5rem; color: #ce9178;', 
                'line-height: 1.5rem; color: #9cdcfe;', 
                'line-height: 1.5rem; color: initial;', 
                'line-height: 1.5rem; display: inline-block;',
                'line-height: 1.5rem; background: #333; padding: 0 0.8em; border-radius: 0.5em; vertical-align: middle;', 
                'line-height: 1.5rem; background: initial; padding: initial;',
                'line-height: initial; display: initial;'
            );

            exposeJson(text, false);
        }
        catch(err)
        {
            console.error(err);
        }

        window.addEventListener('message', e =>
        {
            if (e.data === 'loaded')
            {
                e.source.postMessage({
                    name: 'json',
                    text: JSON.stringify(JSON.parse(text), null, 4)
                }, chrome.runtime.getURL(''));
            }
        });
    }
    else
    {
        const elem = document.querySelector('body > pre') || document.querySelector("#webkit-xml-viewer-source-xml");
        const text = elem.innerHTML;
        
        Array.from(document.querySelectorAll('body > :not(iframe), head > *')).forEach(elem => elem.remove());

        window.addEventListener('message', e =>
        {
            if (e.data === 'loaded')
            {
                e.source.postMessage({
                    name: 'other',
                    text,
                    mimeType: document.contentType
                }, chrome.runtime.getURL(''));
            }
        });
    }
}

function isValidJSON(str)
{
    try 
    {
        JSON.parse(str);
    }
    catch (e)
    {
        return false;
    }

    return true;
}

function exposeJson(text)
{
    // Prints the json to console for now, until I find a way to expose it in window.json
    window.json = JSON.parse(text);
    console.dir(json);

    // Doesn't work because it violates the following Content Security Policy directive: "script-src 'self' 'wasm-unsafe-eval'".
    // function main()
    // {
    //     window.json = JSON.parse(text);
    //     console.log('bla');
    // }
      
    // let script = document.createElement('script');
    // script.appendChild(document.createTextNode('('+ main +')();'));
    // (document.body || document.head || document.documentElement).appendChild(script);
}
  