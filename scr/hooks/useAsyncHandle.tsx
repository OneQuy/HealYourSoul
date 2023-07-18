import { useEffect, useState } from 'react';

export default function useAsyncHandle(asyncFunc: () => Promise<void>) {    
    const [handled, setHandled] = useState(false);

    useEffect(() =>
    {
       const Load = async () =>
       {
            await asyncFunc();
            setHandled(true);
       }

       Load();
    }, [])

    return handled;
}