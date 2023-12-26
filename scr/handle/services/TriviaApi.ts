import { Trivia } from "../../constants/Types";

export const GetTriviaAsync = async (): Promise<Trivia | undefined> => {
    try {
        const res = await fetch('https://opentdb.com/api.php?amount=1')

        if (res.status !== 200)
            return undefined

        const json = await res.json()
        const data = json.results[0]

        // console.log(data);
        
        return {
            question: data.question,
            answer: data.correct_answer,
            incorrectAnswer: data.incorrect_answers,
            category: data.category,
            difficulty: data.difficulty,
        } as Trivia
    } catch (error) {
        console.error(error);
        return undefined
    }
}