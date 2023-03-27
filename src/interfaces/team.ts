interface ITeamMember{
    name: string;
    email: string;
}

export default interface ITeam {
    name: string;
    email: string;
    teamMembers: [ITeamMember];
    competition: string;
    score: number;
    isValid: boolean;
    isPresent: boolean;
    getLunch: boolean;

}

