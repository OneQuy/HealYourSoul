// https://opentdb.com/api_config.php

import { Trivia, TriviaAnswerType, TriviaDifficulty } from "../../constants/Types";
import { DelayAsync } from "../Utils";
import { atob } from "../UtilsTS";

// https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple&encode=base64

// {"category": "RW50ZXJ0YWlubWVudDogVmlkZW8gR2FtZXM=", "correct_answer": "RmFsc2U=", "difficulty": "ZWFzeQ==", "incorrect_answers": ["VHJ1ZQ=="], "question": "IlJlc2lkZW50IEV2aWwgNyIgaXMgdGhlIGZpcnN0IGZpcnN0LXBlcnNvbiBSZXNpZGVudCBFdmlsIGdhbWUu", "type": "Ym9vbGVhbg=="}

export const GetTriviaAsync = async (difficulty: TriviaDifficulty = 'all', answerType: TriviaAnswerType = 'all'): Promise<Trivia | undefined> => {
    try {
        let res: Response | undefined = undefined
        const diff = difficulty === 'all' ? '' : ('&difficulty=' + difficulty)

        let answerTypeParam = ''

        if (answerType === 'multi')
            answerTypeParam = '&type=multiple'
        else if (answerType === 'truefalse')
            answerTypeParam = '&type=boolean'

        const url = 'https://opentdb.com/api.php?amount=1&encode=base64' + diff + answerTypeParam
        // console.log(url);

        for (let i = 0; i < 5; i++) {
            res = await fetch(url)

            if (res.status === 200) {
                break
            }
            else
                await DelayAsync(500)
        }

        if (!res || !res.ok) {
            return undefined
        }

        const json = await res.json()
        const data = json.results[0]

        if (!data)
            return undefined

        // console.log(data)
        // console.log(atob(data.difficulty))
        // console.log(atob(data.type))

        return {
            question: atob(data.question),
            answer: atob(data.correct_answer),
            incorrectAnswer: data.incorrect_answers.map((i: string) => atob(i)),
        } as Trivia
    } catch (error) {
        console.error(error);
        return undefined
    }
}