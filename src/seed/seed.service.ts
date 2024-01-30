import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  /* para traer el modelo de los pokemon temos q hacer la inyeccion dependencia 
  se exporta en el modulo de pokemon el exports:[MongooseModule]
  se importa en el modulo de seed imports:[PokemonModule]
  */
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );
    data.results.forEach(async ({ name, url }) => {
      const segmentos = url.split('/'); //cortamos el url
      const no = +segmentos[segmentos.length - 2]; //extraemos el penultima posicion donde esta en numero

      const pokemon = await this.pokemonModel.create({ no, name });
    });
    return `seed executed`;
  }
}
