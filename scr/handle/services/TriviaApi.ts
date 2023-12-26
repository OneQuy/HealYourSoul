// https://opentdb.com/api_config.php

import { Trivia } from "../../constants/Types";
import { DelayAsync } from "../Utils";
import { atob } from "../UtilsTS";

export const GetTriviaAsync = async (): Promise<Trivia | undefined> => {
    try {
        let res: Response | undefined = undefined

        for (let i = 0; i < 5; i++) {
            res = await fetch('https://opentdb.com/api.php?amount=1&encode=base64')
            
            if (res.status === 200) {
                break
            }
            else
                await DelayAsync(500)
        }

        if (!res || res.status !== 200) {
            // console.log(res);

            return undefined
        }

        const json = await res.json()
        const data = json.results[0]

        // console.log(data.question)

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