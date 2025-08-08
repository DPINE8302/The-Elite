import { useState } from "react";
import { useGameContext } from "@/context/game-context";
import CharacterCreation from "@/components/character-creation";
import AegisOS from "@/components/aegis-os";

export default function Game() {
  const { state } = useGameContext();

  if (!state.gameActive) {
    return <CharacterCreation />;
  }

  return <AegisOS />;
}
