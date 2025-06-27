
import { Button as AntButton, type ButtonProps as AntButtonProps } from "antd"
type ButtonProps= AntButtonProps & {
    children:React.ReactNode
}
const Button:React.FC<ButtonProps>=({children,...props})=>{
    return(
        <AntButton {...props}>
            {children}
        </AntButton>
    )
}

export default Button