let editor;

require.config({
    paths:
    {
      vs: '../lib/monaco-editor/min/vs',
    }
});

window.parent.postMessage('loaded', '*');

require(['vs/editor/editor.main'], () =>
{
    editor = monaco.editor.create(document.querySelector('.editor-container'), {
        theme: 'vs-dark',
        scrollBeyondLastLine: true,
        readOnly: true,
        cursorBlinking: 'smooth',
        dragAndDrop: true,
        mouseWheelZoom: true,
        wordWrap: true
    });

    window.addEventListener('resize', () =>
    {
        editor.layout();
    });
});

window.addEventListener('message', e =>
{
    let model;

    if(e.data.name === 'json')
    {
        require(['vs/editor/editor.main'], () =>
        {
            model = monaco.editor.createModel(e.data.text, 'json');
            editor.setModel(model);
        });
    }
    else (e.data.name === 'other')
    {
        require(['vs/editor/editor.main'], () =>
        {
            const lang = e.data.mimeType?.split('/')?.[1];

            if(!lang) return;

            model = monaco.editor.createModel(e.data.text, lang);
            editor.setModel(model);
        });
    }
});



