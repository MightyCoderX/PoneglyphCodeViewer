let editor;

require.config({
    paths:
    {
      vs: '../lib/monaco-editor/min/vs',
    }
});

window.parent.postMessage('loaded', '*');

window.addEventListener('message', e =>
{
    if(e.data.name === 'json')
    {
        require(['vs/editor/editor.main'], () =>
        {
            editor = monaco.editor.create(document.querySelector('.container'), {
                value: e.data.json,
                language: 'json',
                theme: 'vs-dark',
                scrollBeyondLastLine: true,
                readOnly: true,
                cursorBlinking: 'smooth',
                dragAndDrop: true,
                mouseWheelZoom: true,
                wordWrap: true
            });
        });

        window.addEventListener('resize', () =>
        {
            editor.layout();
        });
    }
});



