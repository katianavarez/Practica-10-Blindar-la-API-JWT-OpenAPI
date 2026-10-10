import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { NuevoUsuario, Rol, Usuario } from '../dominio/usuario';
import { UsuarioRepository } from '../dominio/usuario.repository';

const CUENTAS: NuevoUsuario[] = [
  { correo: 'karla@itson.mx', passwordHash: '', rol: Rol.miembro, miembroId: 1 },
  { correo: 'ana@itson.mx', passwordHash: '', rol: Rol.entrenador, miembroId: null },
  { correo: 'admin@itson.mx', passwordHash: '', rol: Rol.admin, miembroId: null },
];

@Injectable()
export class UsuarioMemoriaRepository implements UsuarioRepository {
  private readonly datos = new Map<number, Usuario>();
  private siguienteId = 1;

  constructor() {
    const hash = bcrypt.hashSync('gimnasio2026', 10);
    for (const c of CUENTAS) {
      void this.guardar({ ...c, passwordHash: hash });
    }
  }

  async buscarPorCorreo(correo: string): Promise<Usuario | null> {
    const buscado = correo.toLowerCase();
    return [...this.datos.values()].find((u) => u.correo === buscado) ?? null;
  }

  async guardar(nuevo: NuevoUsuario): Promise<Usuario> {
    const usuario: Usuario = {
      ...nuevo,
      correo: nuevo.correo.toLowerCase(),
      id: this.siguienteId++,
      creadoEn: new Date(),
    };
    this.datos.set(usuario.id, usuario);
    return usuario;
  }
}
