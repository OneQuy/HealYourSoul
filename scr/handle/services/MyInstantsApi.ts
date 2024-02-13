export const GetListMyInstantAsync = async () => {
    const w = await fetch('https://www.myinstants.com/en/best_of_all_time/us/')
    
    const t = await w.text()

    console.log(t);
    
}