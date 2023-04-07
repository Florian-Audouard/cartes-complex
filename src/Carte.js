import { useState, useEffect } from "react";
import "./Carte.css";
import Card from "./class/Card";

function Carte() {
	const [ex, setEx] = useState();
	const [currentEx, setCurrentEx] = useState();

	useEffect(() => {
		let tmpEx = [];
		fetch("json/exercices.json")
			.then((response) => response.text())
			.then((data) => {
				tmpEx = JSON.parse(data);
				setEx(tmpEx);
				console.log(tmpEx[0][0]);
				const tmp = toClass(tmpEx[0][0][0], 0);
				console.log(tmp.toString());
				setCurrentEx(tmp);
			});
	}, []);

	const toClass = (obj, i) => {
		// Si c'est une carte complexe
		if (obj.color === undefined)
			return new Card(
				i,
				null,
				false,
				obj.link,
				toClass(obj.left, 0),
				toClass(obj.right, 1)
			);
		// Si c'est une carte simple
		else return new Card(i, obj.color, false, "", null, null);
	};
	const matToString = (mat) => {
		let tmp = "";
		let res = "";
		for (let e of mat) {
			tmp = "";
			for (let y of e) {
				tmp += y + " ";
			}
			res += `"${tmp}" \n`;
		}
		return res;
	};

	const insertLink = (mat) => {
		let savePoint = [];
		let i = 0;
		let j = 0;
		for (let e of mat) {
			j = 0;
			for (let y of e) {
				if (y === ".") {
					if (e[j - 1] !== "." && e[j + 1] !== ".") {
						savePoint.push([i, j, e[j - 1], e[j + 1]]);
					}
					if (
						mat[i - 1] !== undefined &&
						mat[i + 1] !== undefined &&
						mat[i - 1][j] !== "." &&
						mat[i + 1][j] !== "."
					) {
						savePoint.push([i, j, mat[i - 1][j], mat[i + 1][j]]);
					}
				}
				j++;
			}
			i++;
		}
		let obj = {};
		for (let e of savePoint) {
			if (obj[e[2] + e[3]] === undefined) {
				obj[e[2] + e[3]] = [];
			}
			obj[e[2] + e[3]].push([e[0], e[1], [[e[2], e[3]]]]);
		}
		let saveLink = [];
		i = 1;
		// while (obj.length !== 0) {
		for (let j = 0; j < 5; j++) {
			for (let k in obj) {
				let repere = [];
				let x = 0;
				for (let e of obj[k][0][2]) {
					repere.push([]);
					for (let t of e) {
						repere[x].push(parseInt(t.replace("a", "")));
					}
					x++;
				}
				if (repere.every((elem) => Math.abs(elem[1] - elem[0]) === i)) {
					let mid = obj[k][Math.trunc(obj[k].length / 2)];
					console.log(mid[0], mid[1]);
					mat[mid[0]][mid[1]] =
						"link" + repere.map((elem) => elem[0] + "" + elem[1]);
					saveLink.push(repere);
					delete obj[k];
				}
			}
			for (let k in obj) {
				for (let v in obj) {
					// let repere11 = parseInt(obj[k][0][2].replace("a", ""));
					// let repere12 = parseInt(obj[k][0][3].replace("a", ""));
					// let repere21 = parseInt(obj[v][0][2].replace("a", ""));
					// let repere22 = parseInt(obj[v][0][3].replace("a", ""));
					// for (let o of saveLink) {
					// 	if ([repere11, repere22] == o) {
					// 	}
					// }
				}
			}
			i++;
		}

		console.log(matToString(mat));
	};

	const multipleMatrixBy3 = (mat) => {
		let res = [];
		let tmp = [];
		let tmp2 = [];
		let saveTmp = [];
		let saveY = "";
		for (let e of mat) {
			saveTmp = tmp;
			tmp = [];
			saveY = "";
			for (let y of e) {
				if (saveY !== "" && saveY !== y) {
					tmp.push(".");
				} else if (saveY !== "") {
					tmp.push(y);
				}
				for (let i = 0; i < 3; i++) {
					tmp.push(y);
				}
				saveY = y;
			}
			tmp2 = [];
			if (saveTmp.length !== 0) {
				for (let [o, v] of saveTmp) {
					if (o === tmp[v]) {
						tmp2.push(o);
					} else {
						tmp2.push(".");
					}
				}
				res.push(tmp2);
			}
			for (let i = 0; i < 3; i++) {
				res.push([...tmp]);
			}
		}
		return res;
	};
	const recurciveDisposition = (
		res,
		card,
		posX,
		posY,
		count,
		sizeX,
		sizeY,
		countRecur
	) => {
		if (card.color !== null) {
			sizeX *= 2;
			sizeY *= 2;
			if (sizeX > 1 && countRecur % 2 === 0) {
				sizeX = sizeX / 2;
			}
			if (sizeY > 1 && countRecur % 2 !== 0) {
				sizeY = sizeY / 2;
			}
			for (let i = 0; i < sizeX; i++) {
				if (res[posX + i] === undefined) {
					res[posX + i] = [];
				}
				for (let j = 0; j < sizeY; j++) {
					res[posX + i][posY + j] = "a" + count;
				}
			}
			// alert(`${sizeX} , ${sizeY},${"a" + count}`);
			return [res, count + 1];
		}
		let posX_add = 0;
		let posY_add = 0;
		if (countRecur % 2 === 0) {
			posX_add = 0;
			posY_add = 1 * Math.max(sizeY / 2, 1);
		} else {
			posX_add = 1 * Math.max(sizeX / 2, 1);
			posY_add = 0;
		}
		let tmp = recurciveDisposition(
			res,
			card.left,
			posX,
			posY,
			count,
			sizeX / 2,
			sizeY / 2,
			countRecur + 1
		);
		res = tmp[0];
		count = tmp[1];
		let save_count = count;
		tmp = recurciveDisposition(
			res,
			card.right,
			posX + posX_add * 1,
			posY + posY_add * 1,
			count,
			sizeX / 2,
			sizeY / 2,
			countRecur + 1
		);

		res = tmp[0];
		count = tmp[1];
		// res[posX + posX_add][posY + posY_add] =
		// 	"link" + (save_count - 1) + (count - 1);
		return [res, count];
	};
	const getGridTemplate = (card) => {
		const num = card.getProfondeur();
		const nbTotal = Math.pow(2, num - 1);
		let nbCol;
		let nbRow;
		if ((num - 1) % 2 === 0) {
			nbCol = Math.sqrt(nbTotal);
			nbRow = Math.sqrt(nbTotal);
		} else {
			nbCol = 1;
			nbRow = 2;
			while (nbCol * nbRow !== nbTotal) {
				nbCol = nbCol * 2;
				nbRow = nbRow * 2;
			}
		}
		const matrix = [];
		for (var y = 0; y < nbCol; y++) {
			matrix[y] = [];
			for (var x = 0; x < nbRow; x++) {
				matrix[y][x] = "undefined";
			}
		}

		const tmp = recurciveDisposition(
			matrix,
			card,
			0,
			0,
			1,
			nbCol,
			nbRow,
			0
		);
		const resultat = tmp[0];
		// insertLink(multipleMatrixBy3(resultat));
		return matToString(resultat);
	};

	function recurciveRender(card, num) {
		if (card.color !== null) {
			return [
				<span
					className="card_simple"
					style={{ backgroundColor: card.color, gridArea: "a" + num }}
				></span>,
				num + 1,
			];
		}
		let classLinkDynamique = "link" + num;
		let tmp = recurciveRender(card.left, num);
		let carte1 = tmp[0];
		num = tmp[1];
		classLinkDynamique += num;
		//${classLinkDynamique}
		let link = (
			<span
				className={`link`}
				style={{ gridColumn: "1 / 3", gridRow: 1 }}
			>
				{card.link}
			</span>
		);
		tmp = recurciveRender(card.right, num);
		let carte2 = tmp[0];
		num = tmp[1];
		return [[carte1, link, carte2], num];
	}
	function RenderCard(props) {
		const currentCard = props.currentCard;
		if (currentCard === undefined) {
			return <span></span>;
		}
		return recurciveRender(currentCard, 1)[0];
	}

	return (
		<div
			className="carte_container"
			style={
				currentEx !== undefined
					? {
							gridTemplateAreas: `${getGridTemplate(currentEx)}`,
					  }
					: {}
			}
		>
			<RenderCard currentCard={currentEx}></RenderCard>
		</div>
	);
}

export default Carte;
