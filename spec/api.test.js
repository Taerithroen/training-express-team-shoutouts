const request = require('supertest');
const ShoutoutManager = require('../utils/ShoutoutManager');

const baseURL = 'http://localhost:3000';

describe('Тестирование Express сервера', () => {
  let testShoutOut;
  let testShoutOuts;
  beforeEach(async () => {
    testShoutOut = await ShoutoutManager.createShoutout({
      cheerName: 'Кто тут кодит лучше всех?',
      signText: 'В жизни ждёт того успех!',
    });
    testShoutOuts = await ShoutoutManager.getAllShoutouts();
  });
  afterEach(async () => {
    await ShoutoutManager.deleteShoutout({ cheerName: 'Test cheerName' });
    await ShoutoutManager.deleteShoutout({ cheerName: 'Обновленное имя' });
    await ShoutoutManager.deleteShoutout({ cheerName: 'Привет котятки!' });
    await ShoutoutManager.deleteShoutout({ cheerName: 'Кто тут кодит лучше всех?' });
    await ShoutoutManager.deleteShoutout({ cheerName: 'Новая невероятная кричалка!' });
  });

  describe('Обработка успешных запросов', () => {
    it('GET /main - должен возвращать приветственное сообщение', async () => {
      const res = await request(baseURL).get('/main');
      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain('Добро пожаловать на главную страницу!');
    });
    it('GET /search - возвращает результаты поиска с помощью query', async () => {
      const res = await request(baseURL)
        .get('/search')
        .query({ cheerName: testShoutOut.cheerName });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject({
        cheerName: 'Кто тут кодит лучше всех?',
        signText: 'В жизни ждёт того успех!',
      });
    });
    it('GET /shoutouts - возвращает все кричалки', async () => {
      const res = await request(baseURL).get('/shoutouts');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(testShoutOuts);
    });
    it('GET /shoutouts/:id - возвращает кричалку по id', async () => {
      const res = await request(baseURL).get(`/shoutouts/${testShoutOut.id}`);
      expect(res.body).toMatchObject({
        cheerName: 'Кто тут кодит лучше всех?',
        signText: 'В жизни ждёт того успех!',
      });
      expect(res.statusCode).toEqual(200);
    });
    it('POST /shoutouts - создаёт новую кричалку (запрос в формате x-www-url-encoded)', async () => {
      const res = await request(baseURL).post('/shoutouts').send({
        cheerName: 'Привет котятки!',
        signText: 'Удачи ребятки!',
      });
      expect(res.statusCode).toEqual(201);
      const newShoutout = await ShoutoutManager.getShoutout(res.body.id);
      expect(res.body).toMatchObject(newShoutout);
    });
    it('POST /shoutouts - создаёт новую кричалку (запрос в формате json)', async () => {
      const newShoutout = {
        cheerName: 'Новая невероятная кричалка!',
        signText: 'Новый невероятный ответ!',
      };
      const res = await request(baseURL)
        .post('/shoutouts')
        .send(newShoutout)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(201);
      expect(res.body.cheerName).toEqual(newShoutout.cheerName);
      expect(res.body.signText).toEqual(newShoutout.signText);
    });
    it('PUT /shoutouts/:id - обновляет существующую кричалку', async () => {
      const { id } = testShoutOuts[testShoutOuts.length - 1];
      const updatedData = { cheerName: 'Обновленное имя', signText: 'Обновленный текст' };
      // Предполагается, что в базе данных есть кричалка с данным id для обновления
      const res = await request(baseURL).put(`/shoutouts/${id}`).send(updatedData);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', id);
      expect(res.body.cheerName).toEqual(updatedData.cheerName);
      expect(res.body.signText).toEqual(updatedData.signText);
    });

    it('DELETE /shoutouts/:id - удаляет существующую кричалку', async () => {
      const { id } = testShoutOuts[testShoutOuts.length - 1];
      const res = await request(baseURL).delete(`/shoutouts/${id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain('Кричалка удалена');
    });
  });
  describe('Обработка ошибок', () => {
    it('GET /search - возвращает статус 404, если кричалки не найдены', async () => {
      const res = await request(baseURL).get('/search').query({ cheerName: 'Неизвестное Имя' });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ message: 'Кричалки с таким именем не найдены' });
    });
    it('GET /search - возвращает статус 500, если произошла ошибка на стороне сервера', async () => {
      const res = await request(baseURL).get('/search').query({ cheerName: undefined });
      expect(res.statusCode).toEqual(500);
      expect(res.body).toMatchObject({ type: 'Ошибка при поиске кричалок' });
    });
    it('GET /shoutouts/:id - возвращает статус 404 и сообщение, если кричалка не найдена', async () => {
      const res = await request(baseURL).get('/shoutouts/1234781254');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ message: 'Кричалка не найдена' });
    });
    it('GET 404 page - возвращает статус 404 и сообщение, если такой страницы нет', async () => {
      const random = Math.random();
      const res = await request(baseURL).get(`/${random}`);
      expect(res.statusCode).toEqual(404);
      expect(res.text).toBe('Страница не найдена! 404');
    });
    it('DELETE /shoutouts/:id - возвращает 404 для несуществующей кричалки', async () => {
      const res = await request(baseURL).delete('/shoutouts/9999999'); // Предположим, что такого ID нет в базе
      expect(res.statusCode).toEqual(404);
      expect(res.text).toContain('Кричалка не найдена');
    });
  });
});
