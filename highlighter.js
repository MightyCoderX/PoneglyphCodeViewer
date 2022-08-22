const preElem = document.querySelector('body > pre');

if(preElem && isValidJSON(preElem.innerHTML))
{
    document.body.style.padding = 0;
    document.body.style.margin = 0;
    document.body.style.boxSizing = 'border-box';
    document.body.style.width = '100vw';
    document.body.style.minHeight = '100vh';
    document.body.style.backgroundColor = '#1e1e1e';
    
    const text = preElem.innerHTML;

    preElem.remove();

    try
    {
        exposeJson(text, false);
        console.log(`%c[%cJSONHighlighter%c]%c JSON stored in window.json, enjoy!`, 'color: #9cdcfe;', 'color: #ce9178;', 'color: #9cdcfe;', 'color: initial;');
    }
    catch(err)
    {
        console.error(err);
    }

    const frame = document.createElement('iframe');
    frame.src = chrome.runtime.getURL('/editor/editor.html');
    frame.style = 'border: 0px none; width: 100%; height: 100vh; display: block;';
    document.body.append(frame);

    window.addEventListener('message', e =>
    {
        if (e.data === 'loaded')
        {
            e.source.postMessage({
                name: 'json',
                json: JSON.stringify(JSON.parse(text), null, 4)
            }, chrome.runtime.getURL(''));
        }
    });
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
    console.log(json);

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
  