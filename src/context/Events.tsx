import { ReactNode, createContext, useEffect, useState } from "react";
import { UnionOmit } from "../utils/types";
import { EVENT_COLORS } from "./useEvents";

export type Event = {
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
    addEvent: (eventDetails: UnionOmit<Event, "id">) => void
    updateEvent: (id: string, eventDetails: UnionOmit<Event, "id">) => void
    deleteEvent: (id: string) => void
}

export const Context = createContext<EventsContext | null>(null);

type EventProviderProps = {
    children: ReactNode
}

export function EventsProvider({ children }: EventProviderProps) {
    const [events, setEvents] = useLocalStorage("EVENTS", []);

    function addEvent(eventDetails: UnionOmit<Event, "id">) {
        setEvents(events => [...events, { ...eventDetails, id: crypto.randomUUID() }])
    }

    function updateEvent(id: string, eventDetails: UnionOmit<Event, "id">) {
        setEvents(events => {
            return events.map(e => {
                return e.id === id ? { id, ...eventDetails } : e
            })
        })
    }

    function deleteEvent(id: string) {
        setEvents(events => events.filter(e => e.id !== id))
    }

    return (
        <Context.Provider
            value={{ events, addEvent, updateEvent, deleteEvent }}>
            {children}
        </Context.Provider>
    )
}

function useLocalStorage(key: string, initialValue: Event[]) {
    const [value, setValue] = useState<Event[]>(() => {
        const jsonValue = localStorage.getItem(key);
        if (jsonValue == null) return initialValue

        return (JSON.parse(jsonValue) as Event[]).map(event => {
            if (event.date instanceof Date) return event
            return { ...event, date: new Date(event.date) }
        })
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key]);

    return [value, setValue] as const;


}




