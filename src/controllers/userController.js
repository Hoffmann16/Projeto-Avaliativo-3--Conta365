const { getData, addData } = require("../utils/functions");

const findUser = (req, res) => {
  const { id } = req.params;
  const data = getData("users");

  if (isNaN(id)) {
    return res.status(400).send("Id informado não é válido");
  }

  const dataFiltered = data.filter((x) => x.id == Number(id))[0];

  if (!dataFiltered) {
    return res.status(400).send("Id do usuário não encontrado no sistema");
  } else {
    return res
      .status(200)
      .send(
        `User: ${dataFiltered["name"]} || Email: ${dataFiltered["email"]}`
      );
  }
};

const addUser = (req, res) => {
  const { name, email } = req.body;

  if (!name || typeof name != "string") {
    return res
      .status(400)
      .send("Nome informado não é válido. Item obrigatório");
  }
  if (!email || typeof email != "string") {
    return res
      .status(401)
      .send("Email informado não é válido. Item obrigatório");
  }

  const data = getData("users");

  const novoCliente = {
    id: data[data.length - 1].id + 1,
    name: name,
    email: email,
  };

  addData(data, novoCliente, "users");

  return res.status(200).send("Usuário adicionado com sucesso");
};

const changeUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (isNaN(id)) {
    return res.status(400).send("Id informado não é válido");
  }

  if (!name && !email) {
    return res.status(401).send("Parâmetro para alterar não informado");
  }

  const data = getData("users");
  const dataFiltered = data.filter((x) => x.id == Number(id))[0];

  if (!dataFiltered) {
    return res.status(402).send("Id do usuário não encontrado no sistema");
  }

  if (name) {
    if (typeof name != "string") {
      return res
        .status(403)
        .send("Nome informado não é válido.");
    }
    dataFiltered.name = name
  }

  if (email) {
    if (typeof email != "string") {
      return res
        .status(404)
        .send("Email informado não é válido.");
    }
    dataFiltered.email = email
  }

  addData(data,null, "users");

  return res.status(200).send('Alteração realizada com sucesso')
};

module.exports = {
  findUser,
  addUser,
  changeUser,
};
