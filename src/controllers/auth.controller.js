import { v4 } from 'uuid';
import { Router, } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

const userLocalDB = {
  id: v4(),
  name: 'Brian Castro',
  email: 'brian@mail.com',
  password: '12345',
  loginCount: 1,
  loginDelay: null,
  disabled: false,
}

router.post('/signup', (req, res) => {
  const { user, } = req;

  const emailExist = userLocalDB['email'];

  if (emailExist) {
    return res.status(400).json({ message: 'Email exist', });
  }

  userLocalDB = {
    ...user,
  };

  const token = jwt.sign({
    iss: 'http://localhost',
    sub: userLocalDB.id,
    aud: 'client',
    exp: Date.now() + 300,
    iat: Date.now(),
    email: userLocalDB.email,
  }, process.env.SECRET_KEY, {
    algorithm: 'HS256',
  });

  return res.status(200).json({ token, });
});

/**
 * 
 * Si un usuario falla en su inicio de sesión 3 veces consecutivas, debe bloquearse la 
 * cuenta por 2 horas. 
 * 
 */
router.post('/login', (req, res) => {
  const { email, password, } = req.body;

  // Paso 1. Validamos que no exista un delay y que la fecha actual ya haya superado el delay
  // dado el caso, reiniciamos todos los valores.
  if (userLocalDB.loginDelay && Date.now() > userLocalDB.loginDelay) {
    userLocalDB.disabled = false;
    userLocalDB.loginDelay = null;
    userLocalDB.loginCount = 1;
  }

  if (email !== userLocalDB.email) {
    return res.status(401).json({ message: 'El email es invalido', });
  }

  if (userLocalDB.password !== password ) {
    // Paso 2. Si el usuario falla en la contraseña, se le suma un conteo
    userLocalDB.loginCount = userLocalDB.loginCount + 1;

    // Paso 3. Si el conteo llega o supera las 3 peticiones y no existe un delay,
    // se le asigna un nuevo bloqueo de 2 minutos (60000 ms).
    if (userLocalDB.loginCount >= 3 && !userLocalDB.loginDelay) {
      userLocalDB.loginDelay = Date.now() + 60000; // 7200 = 2 horas;
      userLocalDB.disabled = true;
    }
    return res.status(401).json({ 
      message: 'La contrasena es invalida',
      loginCount: userLocalDB.loginCount,
    });
  }

  // Paso 4. Si el conteo de inicio de sesion supera los 3 intentos y el usuario esta deshabilitado se le retorna una respuesta
  // invalida
  if (userLocalDB.loginCount >= 3 || userLocalDB.disabled ) {
    return res.status(401).json({ message: 'El usuario esta deshabilitado temporalmente', });
  }

  // Paso 5. Si el usuario ya supero el delay y no esta deshabilitado, se procede con el inicio de sesion.
  if (Date.now() > userLocalDB.loginDelay && !userLocalDB.disabled) {
    const token = jwt.sign({
      iss: 'http://localhost',
      sub: userLocalDB.id,
      aud: 'client',
      exp: Date.now() + 300,
      iat: Date.now(),
      email: userLocalDB.email,
    }, process.env.SECRET_KEY, {
      algorithm: 'HS256',
    });

    return res.status(200).json({ token, message: 'El usuario se ha autenticado', });
  }

  return res.status(401).json({ message: 'Ocurrio un error', });
});

export default router;