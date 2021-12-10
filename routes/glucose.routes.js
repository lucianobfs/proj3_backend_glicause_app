// Importar o express
const express = require("express");

// Configura um roteador
const router = express.Router();

// Importar o modelo da coleção
const UserModel = require("../models/User.model");
const GlucoseModel = require("../models/Glucose.model");

// importar middlewares
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

// CRUD

// Crud Create (POST)

router.post(
  "/glucose",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      // Extrair as informações do corpo da requisição
      console.log(req.body);

      // Inserir no banco
      const result = await GlucoseModel.create(req.body);

      // Atualizar a array de glicose do usuário
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: req.currentUser._id },
        { $push: { glucose: result } }, // Adicionar um novo elemento (glicose recém-criada) no campo 'glucose' que é do tipo array
        { new: true, runValidators: true }
      );

      console.log(updatedUser);

      // Responder a requisição
      // Pela regra do REST, a resposta de uma inserção deve conter o registro recém-inserido com status 201 (Created)

      res.status(201).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

// CRUD Read (GET) -Lista-

router.get("/glucose", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    // Buscar as informações no banco
    const glucoseList = await GlucoseModel.find();

    // Responder a requisição
    res.status(200).json(glucoseList);
  } catch (err) {
    console.log(err);
    res.status();
  }
});

// CRUD Read (GET) -Detalhe-

router.get("/glucose/:id", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    // Buscar as informações no banco
    const details = await GlucoseModel.findOne({ _id: req.params.id });

    // Verificar se o banco encontrou o produto
    if (!details) {
      return res.status(404).json({ msg: "Glucose not found." });
    }

    // Responder a requisição
    res.status(200).json(details);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// PATCH => atualização (não-destrutiva)

// CRUD Update (PATCH) -Atualizar-

router.patch("/glucose/:id", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    // Atualizar o registro
    const result = await GlucoseModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!result) {
      return res.status(404).json({ msg: "Glucose not found." });
    }

    // Responder a requisição
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// CRUD Delete (DELETE) -Deletar-

router.delete("/glucose/:id", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    const result = await GlucoseModel.deleteOne({ _id: req.params.id });

    // const deletedGlucose = await UserModel.findOneAndUpdate({_id: req.params.id}, )

    if (result.deletedCount < 1) {
      return res.status(404).json({ msg: "Produto não encontrado" });
    }

    // Pela regra do REST, deleções devem retornar um objeto vazio
    res.status(200).json({});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
