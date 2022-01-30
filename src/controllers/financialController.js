const xlsxPopulate = require("xlsx-populate");
const { getData, addData } = require("../utils/functions");

const handleExcel = async (req, res) => {
  const { userId, nrows } = req.params;
  console.log(req)
  console.log(req.file)

  //conferindo se inputs são numeros
  if (isNaN(userId) || isNaN(nrows)) {
    return res.status(400).send("userId ou nrows informado não é válido");
  }
  //conferindo se usuario existe
  const users = getData("users");
  if (
    !users.filter((x) => {
      return x.id == Number(userId);
    })[0]
  ) {
    return res.status(401).send("Usuário não consta no sistema");
  }

  //download da planilha pelo buffer
  const xlsxBuffer = req.file.buffer;
  const xlsxData = await xlsxPopulate.fromDataAsync(xlsxBuffer);
  const xlsxDataSheet = xlsxData.sheet(0).range(`A1:D${nrows}`).value();

  //verificação nome das colunas
  const firstRow = xlsxDataSheet.splice(0, 1)[0];
  const row = ["price", "typesOfExpenses", "date", "name"];
  if (!firstRow.every((item, index) => item === row[index])) {
    return res
      .status(402)
      .send("Planilha não informada nos parâmetros corretos");
  }

  // verificação se todas colunas estão preenchidas
  xlsxDataSheet.forEach((element) => {
    element.forEach((element2, index2) => {
      if (!element2) {
        return res
          .status(403)
          .send(`Elemento na coluna ${row[index2]} não informado corretamento`);
      }
    });
  });

  //recebe json do financial
  const data = getData("financial");
  const dataFiltered = data.filter((x) => {
    return x.userId == Number(userId);
  })[0];

  // converte numero da data para data em string para ser trabalhada
  xlsxDataSheet.forEach((element) => {
    element[2] = xlsxPopulate
      .numberToDate(element[2])
      .toLocaleDateString("pt-br");
  });

  //cria entrada se usúario não existe ou adiciona financialData
  if (!dataFiltered) {
    const retorno = {
      id: data[data.length - 1].id + 1,
      userId: Number(userId),
      financialData: [],
      count: 0,
    };
    xlsxDataSheet.forEach((element, index) => {
      retorno.financialData.push({
        id: index + 1,
        price: element[0],
        typeOfExpenses: element[1],
        date: element[2],
        name: element[3],
      });
      retorno.count++;
    });

    addData(data, retorno, "financial");
  } else {
    const lastId =
      dataFiltered.financialData[dataFiltered.financialData.length - 1].id;

    xlsxDataSheet.forEach((element, index) => {
      dataFiltered.financialData.push({
        id: dataFiltered.count + 1,
        price: element[0],
        typeOfExpenses: element[1],
        date: element[2],
        name: element[3],
      });
      dataFiltered.count++;
    });


    addData(data, "", "financial");
  }
  return res.status(200).send("Informação adicionada com sucesso");
};

const removeFinancialData = (req, res) => {
  const { userId, financialDataId } = req.params;

  //checar se é número
  if (isNaN(userId) || isNaN(financialDataId)) {
    return res
      .status(400)
      .send("userId ou financialDataId informado não é válido");
  }

  const financialData = getData("financial");

  //filtra o elemento com userId
  const financialDataFiltered = financialData.filter((x) => {
    return x.userId == Number(userId);
  })[0];

  //usuário não presente
  if (!financialDataFiltered) {
    return res.status(401).send("Usuário não encontrado");
  }

  const userFinancialData = financialDataFiltered.financialData;

  //filtra o elemento com financialDataId
  const financialDataFiltered2 = userFinancialData.filter((x) => {
    return x.id == Number(financialDataId);
  })[0];

  //transação não presente
  if (!financialDataFiltered2) {
    return res.status(402).send("Transação não encontrado");
  }

  userFinancialData.splice(
    userFinancialData.indexOf(financialDataFiltered2),
    1
  );

  addData(financialData, "", "financial");

  return res.status(200).send("Operação removida com sucesso");
};

const sumExpenses = (req, res) => {
  const { userId } = req.params;

  //checar se userId é número
  if (isNaN(userId)) {
    return res.status(400).send("userId informado não é válido");
  }

  //chegar se userId esta no sistema
  const users = getData("users");
  if (
    !users.filter((x) => {
      return x.id == Number(userId);
    })[0]
  ) {
    return res.status(400).send("Usuário não consta no sistema");
  }

  //recebe json do financial
  const data = getData("financial");
  const dataFiltered = data.filter((x) => {
    return x.userId == Number(userId);
  })[0];

  const saida = {};
  //erro se usuário não tem transações ou calculo da soma
  if (!dataFiltered) {
    return res.status(400).send("Usúario não possui transação registradas");
  } else {
    const financialData = dataFiltered.financialData;
    //confere se esta sendo usado algum filtro
    if (Object.keys(req.query)[0]) {
      const typeOfExpensesFilter = financialData.filter((x) => {
        return x.typeOfExpenses == req.query[Object.keys(req.query)[0]];
      });
      if (!typeOfExpensesFilter[0]) {
        return res.status(401).send("typeOfExpense não possui gastos");
      }
      typeOfExpensesFilter.forEach((element) => {
        const time =
          element.date.split("/")[1] + "/" + element.date.split("/")[2];
        const price = element.price;

        //adicionando primeiro componente
        if (!saida[time]) {
          saida[time] = price;
        } else {
          saida[time] = saida[time] + price;
        }
      });
      return res.status(200).send(saida);
      // sem filtro
    } else {
      financialData.forEach((element) => {
        const time =
          element.date.split("/")[1] + "/" + element.date.split("/")[2];
        const price = element.price;

        //adicionando primeiro componente
        if (!saida[time]) {
          saida[time] = price;
        } else {
          saida[time] = saida[time] + price;
        }
      });
      return res.status(200).send(saida);
    }
  }
};

module.exports = {
  handleExcel,
  removeFinancialData,
  sumExpenses,
};
