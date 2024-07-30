import { validateRequest } from "@/utils/auth";
import { prisma } from "@/lib/prismaDB";
import { PostCardDataType } from "@/utils/types";

export async function GET() {
    try {
        // GET USER FROM SESSION
        const {user}= await validateRequest();

        // CHECK IF USER EXISTS
        if (!user) {
            return Response.json({error: "Unauthorized"}, {status: 401});
        }

        // GET POSTS
        const posts = await prisma.post.findMany({
            include: PostCardDataType,
            orderBy: {createdAt: "desc"}
        });

        // RETURN POST
        return Response.json(posts);
    } 
    catch (error) {
        console.log(error);
        return Response.json({error: "Internal server error."}, {status: 500})    
    }
}