import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";


export const UserAvatar = ({imageUrl, className}: { imageUrl: string | null, className?: string }) => {
    return (
        <Avatar className={className}>
            ( {imageUrl ?
            <AvatarImage src={imageUrl}/> :
            <AvatarFallback/>
        } )
        </Avatar>
    )
}