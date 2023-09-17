// manipulação de arquivos e pastas de diretórios
import fs from "fs"
//usada para converter o mp4 no formato wav
import wav from "node-wav"
// usada para manipular o audio
import ffmpeg from "fluent-ffmpeg"
// para apontar de forma estática e dizer para qual biblioteca 
//ffmpeg estamos utlizando, no caso o Fluent
import ffmpegStatic from "ffmpeg-static"

//aonde estou salvando o arquivo
const filePath = "./tmp/audio.mp4"
// aonde eu vou salvar o arquivo convertido
const outputPath = filePath.replace(".mp4", ".wav")

export const convert = () =>
  new Promise((resolve, reject) => {
    console.log("Convertendo o video...")

    //para conseguir utilizar ele
    ffmpeg.setFfmpegPath(ffmpegStatic)

    ffmpeg()
      .input(filePath) //aonde está o arquivo que quero manipular
      .audioFrequency(16000) // frequencioa de audio suficiente para ele entender
      .audioChannels(1) // 1 canal, primeira posição do array, dados de audio
      .format("wav")
      .on("end", () => {
        //pegar o arquivo e ler este arquivo
        const file = fs.readFileSync(outputPath)
        //decodificar o arquivo, pegar o audio e transformar em código
        const fileDecoded = wav.decode(file)

        //pegar os dados, primeira posição (0) são os dados de audio
        const audioData = fileDecoded.channelData[0]
        //converter para o formato que a IA sabe utilizar (Float32Array)
        const floatArray = new Float32Array(audioData)

        console.log("Video convertido com sucesso!")
        resolve(floatArray) //devolver o floatArray

        fs.unlinkSync(outputPath) // deletar o arquivo ja que nao vamos mais precisar dele
      })
      .on("error", (error) => {
        console.log("Erro ao converter o video", error)
        reject(error)
      })
      .save(outputPath)
  })
