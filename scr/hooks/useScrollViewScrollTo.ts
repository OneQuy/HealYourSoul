import { LayoutChangeEvent, LayoutRectangle, ScrollView } from 'react-native'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 ## USAGE

* DECLARATION:

 ```tsx
const {
    ref: theRef,
    onLayoutItem,
    keyForScollView,

    scrollToItem,
    scrollToIndex,
    readyToScroll,
} = useScrollViewScrollTo(true, items)
```

* SCROLL:

```tsx
useEffect(() => {
    if (!readyToScroll)
      return

    scrollToIndex(3)
    
    // or

    scrollToItem(item)
}, [readyToScroll])
```

* PUT THESE TO ScrollView:

```tsx
<ScrollView
    ref={theRef}
    key={keyForScollView}
    ...
/>
```

* PUT THIS TO THE RENDER ITEM:

```tsx
<View onLayout={onLayoutItem} />
```

 ## NOTE
 The scroll view will re-mounted whenever the items changed
 */
const useScrollViewScrollTo = <T>(
    isHorizontal: boolean,
    items: T[],
    itemToScrollTo?: T,
    itemIndexToScrollTo?: number,
    offset = 0,
) => {
    const ref = useRef<ScrollView | null>(null)
    const layouts = useRef<LayoutRectangle[]>([])
    const [readyToScroll, setReadyToScroll] = useState(false)

    const keyForScollView = useMemo(() => Math.random(), [items])

    const onLayoutItem = useCallback((e: LayoutChangeEvent) => {
        // console.log('on layout', layouts.current.length, items.length);

        layouts.current.push(e.nativeEvent.layout)

        if (layouts.current.length === items.length) {
            if (isHorizontal) {
                layouts.current.sort((a, b) => a.x - b.x)
            }
            else // vertical
                layouts.current.sort((a, b) => a.y - b.y)

            // console.log('fulled');
            setReadyToScroll(true)
        }
    }, [isHorizontal, items])

    const scrollToIndex = useCallback((index: number) => {
        if (layouts.current.length !== items.length) {
            return
        }

        if (!readyToScroll) {
            console.error('[useScrollViewScrollTo] not ready to scroll yet, pls useEffect or wait to readyTosScroll === true first.');
            return
        }

        if (index >= layouts.current.length) {
            console.error('[useScrollViewScrollTo] out of index to scroll');
            return
        }

        if (!ref.current) {
            console.error('[useScrollViewScrollTo] pls set "ref" for the ScrollView');
            return
        }

        ref.current.scrollTo({
            x: isHorizontal ? layouts.current[index].x + offset : 0,
            y: !isHorizontal ? layouts.current[index].y + offset : 0,
        })
    }, [
        items,
        readyToScroll,
        isHorizontal
    ])

    const scrollToItem = useCallback((item: T) => {
        const index = items.indexOf(item)

        if (index < 0) {
            console.error('[useScrollViewScrollTo] can not found item to scroll: ' + JSON.stringify(item))
            return
        }

        scrollToIndex(index)
    }, [items, scrollToIndex])

    // auto scroll when ready

    useEffect(() => {
        if (!readyToScroll)
            return

        if (itemIndexToScrollTo !== undefined)
            scrollToIndex(itemIndexToScrollTo)
        else if (itemToScrollTo !== undefined)
            scrollToItem(itemToScrollTo)
    }, [readyToScroll])

    // reset when changed items

    useEffect(() => {
        // console.log('on change items, cleared', layouts.current.length, items.length);

        layouts.current = []
        setReadyToScroll(false)
    }, [items])

    return {
        ref,
        onLayoutItem,
        scrollToIndex,
        scrollToItem,
        keyForScollView,
        readyToScroll,
    }
}

export default useScrollViewScrollTo