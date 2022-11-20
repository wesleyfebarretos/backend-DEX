"use strict";
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.route("/pokemon").get((req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const offset = req.query.offset || "0";
        const limit = req.query.limit || "24";
        const result = yield axios_1.default.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const jsonAsString = JSON.stringify(result.data);
        const jsonReplaced = jsonAsString.replaceAll("https://pokeapi.co/api/v2/", "http://localhost:3000/");
        const obj = JSON.parse(jsonReplaced);
        obj.count;
        res.send(obj);
        /*result.data.next = `http://localhost:3000/pokemons?offset=${Number(offset) + Number(limit)}&limit=${limit}`
    let numOffset = Number(offset)
    result.data.results = result.data.results.map( (pokemon: any) => {
    pokemon.url = `http://localhost:3000/pokemon/${numOffset++}`
    return pokemon
 });
 
    //res.send(result.data)*/
    })
);
app.route("/pokemon/:pokemon").get((req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const result = yield axios_1.default.get(`https://pokeapi.co/api/v2/pokemon/${req.params.pokemon}`);
        res.send(result.data);
    })
);
app.listen("3000", () => {
    console.log("running on port 3000");
});
