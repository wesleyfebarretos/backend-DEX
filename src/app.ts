import express from "express";
import { Request, Response } from "express";
import axios from "axios";
import cors from 'cors';

const app = express()

app.use(cors())
app.use(express.json())


app.route('/pokemon').get( async (req: Request, res: Response) => {
   const offset = req.query.offset || "0"
   const limit = req.query.limit || "24"
   const result  = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
   const jsonAsString = JSON.stringify(result.data);
   const jsonReplaced = jsonAsString.replaceAll('https://pokeapi.co/api/v2/', "http://localhost:3000/")
   const obj = JSON.parse(jsonReplaced)
   res.send(obj)
   /*result.data.next = `http://localhost:3000/pokemons?offset=${Number(offset) + Number(limit)}&limit=${limit}`
   let numOffset = Number(offset)
   result.data.results = result.data.results.map( (pokemon: any) => {
   pokemon.url = `http://localhost:3000/pokemon/${numOffset++}`
   return pokemon
});

   //res.send(result.data)*/

})

app.route('/pokemon/:pokemon').get( async (req: Request , res: Response) => {
    const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.params.pokemon}`)
    res.send(result.data)  
} ) 

app.listen('3000', () => {
    console.log('running on port 3000')
})