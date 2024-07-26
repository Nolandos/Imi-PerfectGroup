import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface ChangeTitleProps {
  title: string
  canChange: boolean
  onChange?: (title: string) => void
}


function ChangeTitle(props: ChangeTitleProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(props.title)
  const finishHandler = () => {
    setOpen(false)
    if (props.onChange) {
      props.onChange(inputValue)
    }
  }
  if (!open) {
    return (
      <div onClick={() => { setOpen(props.canChange && true) }}>
        {props.title}
      </div>
    )
  }
  return (
    <div className="flex gap-1 flex-col justify-between w-full">
      <Input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
      <Button size={"sm"} onClick={finishHandler}>Zapisz</Button>
    </div>
  )
}

export default ChangeTitle
