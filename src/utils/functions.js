const fs = require("fs");

const getData = (data) => {
  try {
    const result = JSON.parse(
      fs.readFileSync(`src/database/${data}.json`, "utf-8")
    );
    return result;
  } catch (error) {
    return undefined;
  }
  // const result = JSON.parse(fs.readFileSync(`src/database/${data}.json`, "utf-8"))
  // return result
};

const addData = (dataOriginal, dataAdicionada, nomeDoArquivo) => {
  if (dataAdicionada) {
    dataOriginal.push(dataAdicionada);
  }
  fs.writeFileSync(
    `src/database/${nomeDoArquivo}.json`,
    JSON.stringify(dataOriginal),
    "utf-8"
  );
};

module.exports = {
  getData,
  addData,
};
