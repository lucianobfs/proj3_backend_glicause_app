// Importar o express
const express = require("express");

// Configura um roteador
const router = express.Router();

// Importar o modelo da coleção
const BlogPostModel = require("../models/BlogPost.model");

// Importar instância do multer que faz os uploads
const uploader = require("../config/cloudinary.config");
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isAdmin = require("../middlewares/isAdmin");
const UserModel = require("../models/User.model");

// // Upload de arquivos no Cloudinary
// router.post(
//     "/upload",
//     isAuthenticated,
//     attachCurrentUser,
//     isAdmin,
//     uploader.single("picture"),
//     (req, res) => {
//         if (!req.file) {
//             return res.status(500).json({ msg: "Upload de arquivo falhou." });
//         }

//         console.log(req.file);

//         return res.status(201).json({ url: req.file.path });
//     }
// );

router.post(
  "/createPost",
  isAuthenticated,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const result = await BlogPostModel.create(req.body);

      const updatedAdmin = await UserModel.findOneAndUpdate(
        { _id: req.currentUser._id },
        { $push: { blogPost: result } },
        { new: true, runValidators: true }
      );
      console.log(updatedAdmin);

      res.status(201).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

// cRud Read (GET) (Lista)

router.get("/blog", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    // Buscar as informações no banco
    const blogList = await BlogPostModel.find();

    // Responder a requisição
    res.status(200).json(blogList);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// cRud Read (GET) (Detalhe)

router.get(
  "/blog/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      // Buscar as informações no banco
      const details = await BlogPostModel.findOne({ _id: req.params.id });

      // Verificar se o banco encontrou o produto
      if (!details) {
        return res.status(404).json({ msg: "Post not found." });
      }

      // Responder a requisição
      res.status(200).json(details);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

router.patch(
  "/editPost/:id",
  isAuthenticated,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      // Extrair os dados do corpo da requisição

      // Atualizar o registro
      const result = await BlogPostModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!result) {
        return res.status(404).json({ msg: "Post not found." });
      }

      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

router.delete(
  "/deletePost/:id",
  isAuthenticated,
  attachCurrentUser,
  isAdmin,
  async (req, res) => {
    try {
      const result = await BlogPostModel.deleteOne({ _id: req.params.id });

      if (result.deletedCount < 1) {
        return res.status(404).json({ msg: "Post not found." });
      }

      // Pela regra do REST, deleções devem retornar um objeto vazio
      res.status(200).json({});
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

module.exports = router;
