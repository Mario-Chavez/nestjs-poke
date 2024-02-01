import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, isValidObjectId } from 'mongoose';

import { Pokemon } from './entities/pokemon.entity';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit'); // .env de defaultLimit
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase(); //minuscula

    try {
      const newPokemon = await this.pokemonModel.create(createPokemonDto);

      return newPokemon;
    } catch (error) {
      this.handlerEceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto; //muestre de a 10 pokemon
    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({
        //ordena
        no: 1,
      })
      .select('-__v'); //saca el parametro
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }
    // MongoId
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // Name
    if (!pokemon) {
      const formattedTerm = term.toLowerCase().trim(); //termino de busqueda sin espacios y en minusculas
      pokemon = await this.pokemonModel.findOne({
        name: { $regex: new RegExp(formattedTerm, 'i') }, //busqueda con caracteres incompletos
      });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `no se encontro el pokemon con el term ${term}`,
      );
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    try {
      await pokemon.updateOne(updatePokemonDto, { new: true }); // se guarda en db
      return { ...pokemon.toJSON(), ...updatePokemonDto }; // se muestra el  dato actualizado
    } catch (error) {
      this.handlerEceptions(error);
    }
  }

  async remove(id: string) {
    // deletedCount contador de alementos eliminados
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with Id ${id} not found `);
    }
    return;
  }

  private handlerEceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException();
  }
}
