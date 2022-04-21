const serverUrl = "http://" + process.env.REACT_APP_SERVER_HOST + ":" + process.env.REACT_APP_SERVER_PORT;
export default ({body, title}) =>{
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <link rel="icon" href="${serverUrl}/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />
            <meta
            name="description"
            content="React App against phpMyAdmin"
            />
            <link rel="stylesheet" href="/assets/index.css" />
            <link rel="manifest" href="${serverUrl}/manifest.json" />
            <title>${title}</title>
        </head>
        <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root">${body}</div>
        </body>
    </html>
    `;
}