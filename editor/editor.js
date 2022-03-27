let editor;

require.config({
    paths: {
      vs: "../lib/monaco-editor/min/vs",
    },
});


window.addEventListener('message', e =>
{
    require(["vs/editor/editor.main"], () => {
        editor = monaco.editor.create(document.querySelector('.container'), {
            value: e.data,
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

    window.addEventListener("resize", function () {
        editor.layout();
    });
});

window.parent.postMessage("loaded", "*");

