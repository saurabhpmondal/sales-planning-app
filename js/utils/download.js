// FILE: js/utils/download.js

/* -----------------------------------
   DOWNLOAD HELPERS
----------------------------------- */

/**
 * Download blob file
 */
export function downloadBlob(
  blob,
  fileName =
    "download.txt"
) {
  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href = url;
  link.download =
    fileName;

  document.body.appendChild(
    link
  );

  link.click();

  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(
      url
    );
  }, 500);
}

/**
 * Download text file
 */
export function downloadText(
  text = "",
  fileName =
    "file.txt"
) {
  const blob =
    new Blob([text], {
      type:
        "text/plain;charset=utf-8"
    });

  downloadBlob(
    blob,
    fileName
  );
}

/**
 * Download JSON file
 */
export function downloadJson(
  data = {},
  fileName =
    "data.json"
) {
  const text =
    JSON.stringify(
      data,
      null,
      2
    );

  downloadText(
    text,
    fileName
  );
}
