import {integer, pgEnum, pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

// --- Enums ---
export const gameStatus = pgEnum("game_status", ["active", "finished"]);
export const roundStatus = pgEnum("round_status", ["pending", "in_progress", "completed"]);

// --- Players ---
export const players = pgTable("players", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(), // external auth/user reference
    name: text("name").notNull(),
    email: text("email").notNull(),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .$onUpdate(() => new Date()),
});

// --- Games ---
export const games = pgTable("games", {
    id: uuid("id").defaultRandom().primaryKey(),
    hostId: uuid("host_id").notNull().references(() => players.id, {onDelete: "cascade"}), // game creator
    status: gameStatus("status").default("active").notNull(),
    winnerId: uuid("winner_id").references(() => players.id), // optional, set when game ends
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .$onUpdate(() => new Date()),
});

// --- GamePlayers (join table between games & players) ---
export const gamePlayers = pgTable("game_players", {
    id: uuid("id").defaultRandom().primaryKey(),
    gameId: uuid("game_id").notNull().references(() => games.id, {onDelete: "cascade"}),
    playerId: uuid("player_id").notNull().references(() => players.id, {onDelete: "cascade"}),
    isHost: integer("is_host").default(0).notNull(), // 1 = host
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// --- Rounds ---
export const rounds = pgTable("rounds", {
    id: uuid("id").defaultRandom().primaryKey(),
    gameId: uuid("game_id").notNull().references(() => games.id, {onDelete: "cascade"}),
    status: roundStatus("status").default("pending").notNull(),
    roundNumber: integer("round_number").notNull(), // ordering within a game
    winnerId: uuid("winner_id").references(() => players.id), // optional round winner
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .$onUpdate(() => new Date()),
});

// --- Scores ---
export const scores = pgTable("scores", {
    id: uuid("id").defaultRandom().primaryKey(),
    roundId: uuid("round_id").notNull().references(() => rounds.id, {onDelete: "cascade"}),
    playerId: uuid("player_id").notNull().references(() => players.id, {onDelete: "cascade"}),
    score: integer("score").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .$onUpdate(() => new Date()),
});

// --- Relations ---
export const gamesRelations = relations(games, ({one, many}) => ({
    host: one(players, {
        fields: [games.hostId],
        references: [players.id],
    }),
    winner: one(players, {
        fields: [games.winnerId],
        references: [players.id],
    }),
    players: many(gamePlayers),
    rounds: many(rounds),
}));

export const gamePlayersRelations = relations(gamePlayers, ({one}) => ({
    game: one(games, {
        fields: [gamePlayers.gameId],
        references: [games.id],
    }),
    player: one(players, {
        fields: [gamePlayers.playerId],
        references: [players.id],
    }),
}));

export const roundsRelations = relations(rounds, ({one, many}) => ({
    game: one(games, {
        fields: [rounds.gameId],
        references: [games.id],
    }),
    scores: many(scores),
    winner: one(players, {
        fields: [rounds.winnerId],
        references: [players.id],
    }),
}));

export const playersRelations = relations(players, ({many}) => ({
    scores: many(scores),
    games: many(gamePlayers),
}));

export const scoresRelations = relations(scores, ({one}) => ({
    round: one(rounds, {
        fields: [scores.roundId],
        references: [rounds.id],
    }),
    player: one(players, {
        fields: [scores.playerId],
        references: [players.id],
    }),
}));

// --- Types ---
export type Players = typeof players.$inferSelect;
export type Games = typeof games.$inferSelect;
export type GamePlayers = typeof gamePlayers.$inferSelect;
export type Rounds = typeof rounds.$inferSelect;
export type Scores = typeof scores.$inferSelect;
