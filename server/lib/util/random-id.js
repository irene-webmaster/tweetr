module.exports = {

  generateRandomId: () => {
    return Math.random().toString(36).substring(20);
  }

}