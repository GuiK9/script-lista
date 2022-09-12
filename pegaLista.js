let axios = require('axios')
let fs = require('fs')
require('dotenv').config()


async function pegaLista() {

    let { cookie, values } = await logIn()


    for (let i = 0; i < values.length; i++) {

        axios({
            url: 'https://dredd.dac.ufla.br/index.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                cookie: cookie
            },
            data: `senha=estudos&prova=${values[i]}`
        }).then((res) => {
            data = res.data
            fs.writeFile(`../../estudos/lista${i}.html`, data, (err) => {
            if(err) {
                console.log(err)
            }
            })
        })
    }

}

async function logIn() {

    let cookieRaw = new Array()

    await axios({
        url: 'https://dredd.dac.ufla.br/',
        method: 'GET',
    }).then((res) => {
        cookieRaw = res.headers['set-cookie'][0]
    })

    let cookie = cookieRaw.slice(0, 36)

    let values = new Array()

    await axios({
        url: 'https://dredd.dac.ufla.br/login.php',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            cookie: cookie
        },
        data: process.env.DATA
    }).then((res) => {
        let data = res.data
        let valuesRaw = []
        let dataxml = data.split('\n')
        dataxml.forEach(element => {
            if (element.search(/[0-9]/) == 40) {
                element.slice(4, 40)
                valuesRaw.push(element)
            }
        })

        for (let i = 0; i < valuesRaw.length; i++) {
            const e = valuesRaw[i]
            values.push(e.slice(40, 44))
        }

    })

    return { cookie, values }
}
pegaLista()