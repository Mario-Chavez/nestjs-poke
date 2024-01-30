import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapters';

@Injectable()
export class SeedService {
  /* para traer el modelo de los pokemon temos q hacer la inyeccion dependencia 
  se exporta en el modulo de pokemon el exports:[MongooseModule]
  se importa en el modulo de seed imports:[PokemonModule]
  */
  constructor(
    // inyeccion el modelo pokemon
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    // inyeccion del adaptador http de axios
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    // borra todos los datos existentes
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    /* se crea un array donde lleva no y name */
    const pokemontoInsert: { no: number; name: string }[] = [];

    data.results.forEach(({ name, url }) => {
      const segmentos = url.split('/'); //cortamos el url
      const no = +segmentos[segmentos.length - 2]; //extraemos el penultima posicion donde esta en numero

      pokemontoInsert.push({ no, name }); // se inserta los datos en cada iteracion
    });

    /* se inserta los pokemon   */
    await this.pokemonModel.insertMany(pokemontoInsert);

    return `Seed executed`;
  }
}
