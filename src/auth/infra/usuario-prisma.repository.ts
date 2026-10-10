import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NuevoUsuario, Rol, Usuario } from '../dominio/usuario';
import { UsuarioRepository } from '../dominio/usuario.repository';

@Injectable()
export class UsuarioPrismaRepository implements UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorCorreo(correo: string): Promise<Usuario | null> {
    const fila = await this.prisma.usuario.findUnique({
      where: { correo: correo.toLowerCase() },
    });
    return fila ? { ...fila, rol: fila.rol as Rol } : null;
  }

  async guardar(nuevo: NuevoUsuario): Promise<Usuario> {
    const fila = await this.prisma.usuario.create({
      data: { ...nuevo, correo: nuevo.correo.toLowerCase() },
    });
    return { ...fila, rol: fila.rol as Rol };
  }
}
