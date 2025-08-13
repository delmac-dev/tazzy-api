import { Router } from "express";
import { supaClient } from "../../lib/supabase";
import { RRule } from "rrule";
import { RULE_BY_DAY } from "../../lib/utils";


const router = Router();

router.get("/test", async (req, res) => {
    const supabase = supaClient();

    res.json({instances: "meow"});

});

export default router;

