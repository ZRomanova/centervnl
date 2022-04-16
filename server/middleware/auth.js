const { validPassword } = require("./password");

module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({ message: 'You are not authorized to view this resource' });
    }
}

module.exports.isAdmin = (req, res, next) => {
    // console.log('admin', req.user)
    if (req.isAuthenticated() && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'You are not authorized to view this resource because you are not an admin.' });
    }
}

module.exports.get = async function(req, res) {
  const candidate = await User.findOne({email: req.body.email}, {email: 1, password: 1}).lean()

  if (candidate) {
    // Проверка пароля, пользователь существует
    const passwordResult = validPassword(candidate.password, req.body.password)
    if (passwordResult) {

      res.status(200).json({
        name: candidate.name,
        surname: candidate.surname,
        isAdmin: candidate.levelStatus == 1 ? true : false,
        password: req.body.password,
        info: candidate.info,
        photo: candidate.photo,
        emo: candidate._id,
        sex: candidate.sex
      })
    } else {
      // Пароли не совпали
      res.status(401).json({
        message: 'Пароли не совпадают. Попробуйте снова.'
      })
    }
  } else {
    // Пользователя нет, ошибка
    res.status(404).json({
      message: 'Пользователь с таким login не найден.'
    })
  }
}