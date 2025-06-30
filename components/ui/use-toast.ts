"use client"

import { useState, useEffect, ReactNode } from "react"

import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000

export type ToasterToast = ToastProps & {
  id: string
  title?: ReactNode
  description?: ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({
            ...t,
            open: false,
          })),
        }
      }

      // Single toast
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }

    case actionTypes.REMOVE_TOAST: {
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    }
  }
}

export function useToast() {
  const [state, dispatch] = useState<State>({ toasts: [] })
  const [mounted, setMounted] = useState(false)

  // Set mounted state after initial render
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleDismiss = (toast: ToasterToast) => {
      dispatch({
        type: actionTypes.DISMISS_TOAST,
        toastId: toast.id,
      })

      if (toast.onDismiss) {
        toast.onDismiss()
      }
    }

    state.toasts.forEach((toast) => {
      if (toast.open === false && !toastTimeouts.has(toast.id)) {
        const timeout = setTimeout(() => {
          toastTimeouts.delete(toast.id)
          dispatch({
            type: actionTypes.REMOVE_TOAST,
            toastId: toast.id,
          })

          if (toast.onRemove) {
            toast.onRemove()
          }
        }, TOAST_REMOVE_DELAY)

        toastTimeouts.set(toast.id, timeout)
      }
    })

    return () => {
      for (const timeout of toastTimeouts.values()) {
        clearTimeout(timeout)
      }
      toastTimeouts.clear()
    }
  }, [state.toasts, mounted])

  function toast({
    ...props
  }: Omit<ToasterToast, "id"> & { duration?: number }) {
    const id = props.id || genId()
    const update = (props: ToasterToast) =>
      dispatch({
        type: actionTypes.UPDATE_TOAST,
        toast: { ...props, id },
      })
    const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

    dispatch({
      type: actionTypes.ADD_TOAST,
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) dismiss()
        },
      },
    })

    const duration = props.duration || 5000
    if (duration > 0) {
      setTimeout(dismiss, duration)
    }

    return {
      id,
      dismiss,
      update,
    }
  }

  function success(
    title: string, 
    description?: string, 
    { ...props }: Omit<ToasterToast, "id"> & { duration?: number } = {}
  ) {
    return toast({ 
      title, 
      description, 
      variant: "success", 
      ...props 
    })
  }
  
  function error(
    title: string, 
    description?: string, 
    { ...props }: Omit<ToasterToast, "id"> & { duration?: number } = {}
  ) {
    return toast({ 
      title, 
      description, 
      variant: "destructive", 
      ...props 
    })
  }

  return {
    toast,
    success,
    error,
    dismiss: (toastId?: string) =>
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
    toasts: state.toasts,
  }
}