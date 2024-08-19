const ProductCategory = require('../models/ProductCategory');

exports.deleteCategory = async (req, res) => {
  try {
    // Verifica o token de autorização
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const categoryId = req.params.id;

    // Verifica se a categoria existe
    const category = await ProductCategory.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Deleta a categoria
    await ProductCategory.destroy({ where: { id: categoryId } });

    // Retorna sucesso sem conteúdo
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
