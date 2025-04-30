export const UseCaseSymbols = {
    // Deck
    RemoveDeckUseCase: Symbol("RemoveDeckUseCase"),
    GetOneDeckUseCase: Symbol("GetOneDeckUseCase"),
    GetDecksUseCase: Symbol("GetDecksUseCase"),
    CreateDeckUseCase: Symbol("CreateDeckUseCase"),

    // Card
    CreateCardUseCase: Symbol("CreateCardUseCase"),
    DeleteCardUseCase: Symbol("DeleteCardUseCase"),
    EditCardUseCase: Symbol("EditCardUseCase"),
    GetCardsUseCase: Symbol("GetCardsUseCase"),
    ManageAndGetCardUseCase: Symbol("ManageAndGetCardUseCase"),

    // User
    CreateUserUseCase: Symbol("CreateUserUseCase"),
    UpdateUserUseCase: Symbol("UpdateUserUseCase"),
    GetOneUserUseCase: Symbol("GetOneUserUseCase"),

    // Attendance
    MarkUserSubmissionUseCase: Symbol("MarkUserSubmissionUseCase"),
    GetUserStatsUseCase: Symbol("GetUserStatsUseCase")
}
