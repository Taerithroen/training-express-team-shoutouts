const { Shoutout } = require('../db/models');

class ShoutoutManager {
  static async createShoutout(data) {
    try {
      const newShoutout = await Shoutout.create(data);
      return newShoutout;
    } catch (error) {
      console.log('Возникла ошибка', error.message);
      throw error;
    }
  }

  static async getShoutout(id) {
    try {
      const shoutout = await Shoutout.findOne({
        where: { id },
        raw: true,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
      return shoutout;
    } catch (error) {
      console.log('Возникла ошибка', error.message);
      throw error;
    }
  }

  static async getAllShoutouts() {
    try {
      const shoutouts = await Shoutout.findAll({
        raw: true,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
      return shoutouts;
    } catch (error) {
      console.log('Возникла ошибка', error.message);
      throw error;
    }
  }

  static async updateShoutout(id, data) {
    try {
      await Shoutout.update(data, { where: { id } });
      const updatedShoutout = await Shoutout.findByPk(id);
      return updatedShoutout;
    } catch (error) {
      console.log('Возникла ошибка', error.message);
      throw error;
    }
  }

  /**
   * Удаляет кричалку из базы данных
   * @async
   * @static
   * @param {Object} params - Параметры для удаления кричалки
   * @param {string | number} [params.id] - Если передаётся id -- кричалка будет удалена по id
   * @param {string} [params.cheerName] - Если id не передан, удаляет кричалку по cheerName
   * @returns {Promise<number>} - Возвращает количество удалённых кричалок
   */
  static async deleteShoutout({ cheerName, id }) {
    try {
      const deleted = await Shoutout.destroy({ where: id ? { id } : { cheerName } });
      return deleted;
    } catch (error) {
      console.log('Возникла ошибка', error.message);
      throw error;
    }
  }
}

module.exports = ShoutoutManager;
