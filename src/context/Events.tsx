import { ReactNode, createContext, useState } from "react";
import { UnionOmit } from "../utils/types";
import { EVENT_COLORS } from "./useEvents";


type Event = {
    id: string
    name: string
    color: (typeof EVENT_COLORS)[number]
    date: Date
} & (
    | { allDay: false; startTime: string; endTime: string }
    | { allDay: true; startTime?: never; endTime?: never }
)

type EventsContext = {
    events: Event[]
    addEvent: (event: UnionOmit<Event, "id">) => void

}

export const Context = createContext<EventsContext | null>(null);

type EventProviderProps = {
    children: ReactNode
}

export function EventsProvider({ children }: EventProviderProps) {
    const [events, setEvents] = useState<Event[]>([]);

    function addEvent(event: UnionOmit<Event, "id">) {
        setEvents(events => [...events, { ...event, id: crypto.randomUUID() }])
    }

    return <Context.Provider value={{ events, addEvent }}>{children}</Context.Provider>
}




