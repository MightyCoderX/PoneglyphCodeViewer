const preElem = document.querySelector('body > pre');

if(preElem && isValidJSON(preElem.innerHTML))
{
    document.body.style.padding = 0;
    document.body.style.margin = 0;
    document.body.style.boxSizing = 'border-box';
    document.body.style.width = '100vw';
    document.body.style.minHeight = '100vh';
    document.body.style.backgroundColor = '#1e1e1e';

    console.log(`%c{%cJSONHighlighter%c}%c JSON stored in window.json, enjoy!`, 'color: blue;', 'color: aqua;', 'color: blue;', 'color: initial;');
    
    const text = preElem.innerHTML;

    preElem.remove();

    exposeJson(text, false);

    const frame = document.createElement('iframe');
    frame.src = chrome.runtime.getURL("/editor/editor.html");
    frame.style = "border: 0px none; width: 100%; height: 100vh; display: block;";
    document.body.append(frame);

    window.addEventListener('message', e =>
    {
        if (e.data === "loaded")
        {
            e.source.postMessage(JSON.stringify(JSON.parse(text), null, 4), chrome.runtime.getURL(""));
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

function exposeJson(text, outsideViewer) {
    console.info("[JSONViewer] Your json was stored into 'window.json', enjoy!");
  
    if (outsideViewer) {
      window.json = JSON.parse(text);
  
    } else {
      var script = document.createElement("script") ;
      script.innerHTML = 'window.json = ' + text + ';';
      document.head.appendChild(script);
    }
  }
  