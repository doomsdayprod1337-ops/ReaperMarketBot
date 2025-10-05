import supabase from "@/services/supabase";
import { useTelegram } from "@/services/telegram";
import { useScoreStore } from "@/stores/score";

const { user } = useTelegram();

const MY_ID = user?.id ?? 4252;

export async function fetchTasks() {
    try {
        const { data } = await supabase.from("tasks").select("*");
        return data || [];
    } catch (error) {
        console.warn("Failed to fetch tasks, using fallback data:", error);
        // Return sample tasks for local development
        return [
            { id: 1, title: "Join our Telegram channel", amount: 10, url: "https://t.me/example" },
            { id: 2, title: "Follow us on Twitter", amount: 15, url: "https://twitter.com/example" },
            { id: 3, title: "Subscribe to our YouTube", amount: 20, url: "https://youtube.com/example" }
        ];
    }
}

export async function getOrCreateUser() {
    try {
        const pontentialUser = await supabase
            .from("users")
            .select()
            .eq("telegram", MY_ID);

        if (pontentialUser.data && pontentialUser.data.length !== 0) {
            return pontentialUser.data[0];
        }

        const newUser = {
            telegram: MY_ID,
            friends: {},
            tasks: {},
            score: 0,
        };

        await supabase.from("users").insert(newUser);
        return newUser;
    } catch (error) {
        console.warn("Failed to get/create user, using fallback data:", error);
        // Return a default user for local development
        return {
            telegram: MY_ID,
            friends: {},
            tasks: {},
            score: 0,
        };
    }
}

export async function updateScore(score) {
    try {
        await supabase.from("users").update({ score }).eq("telegram", MY_ID);
    } catch (error) {
        console.warn("Failed to update score:", error);
    }
}

export async function registerRef(userName, refId) {
    try {
        const { data } = await supabase
            .from("users")
            .select()
            .eq("telegram", +refId);

        const refUser = data[0];

        await supabase
            .from("users")
            .update({
                friends: { ...refUser.friends, [MY_ID]: userName },
                score: refUser.score + 50,
            })
            .eq("telegram", +refId);
    } catch (error) {
        console.warn("Failed to register referral:", error);
    }
}

export async function completeTask(user, task) {
    const score = useScoreStore();
    const newScore = score.score + task.amount;
    score.setScore(newScore);

    try {
        await supabase
            .from("users")
            .update({
                tasks: { ...user.tasks, [task.id]: true },
                score: newScore,
            })
            .eq("telegram", MY_ID);
    } catch (error) {
        console.warn("Failed to complete task:", error);
    }
}
