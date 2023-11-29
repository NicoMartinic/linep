import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Container } from "@mui/material";

export default function SimpleAccordion() {
    return (
        <Container maxWidth="md" sx={{ mt: 2 }}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>What is Linep?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Linep is gamified competition platfom. Compete in games
                        against peers and win rewards based on your skill. Linep
                        is also a gamified DeFi protocol. You can get returns by
                        providing liquidity, buying and selling NFTs or by
                        sponsoring the skill of a champion of your choice.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography>Why Linep?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        In the 2021 Bull Run, we saw the rise of the play 2 earn
                        model based tokenomics design of the DAO's. Those models
                        had one concrete problem: their design was inverse
                        proportional with growth (user acquisition). Linep is a
                        solution to the natural inflationary dynamic of rewards
                        based on monetary emission. On the other hand, Linep has
                        a DeFi design attractive and familiar for financial
                        actors, whales and blockchain natives. With this value
                        proposition, Linep aims to lower the bar for blockchain
                        and DeFi adoption while providing an opportunity for
                        people and insititutions more acquainted with the
                        blockchain ecosystem.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4a-content"
                    id="panel4a-header"
                >
                    <Typography>How does Linep look like?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <ul>
                            Liquidity enters the protocol via DeFi. Similar to
                            how Pooltogether works (not covered in this demo).
                        </ul>
                        <ul>
                            As a reward for providing liquidity, you will
                            recieve NFT tickets (*ERC20 instead for this demo).
                            With those you can:
                            <ul>
                                Use the tickets to enter and play in match rooms
                            </ul>
                            <ul>Sell the tickets in the marketplace</ul>
                        </ul>
                        <ul>
                            Once you get tickets (either buying them or by
                            farming) you can spend those to play in match rooms.
                            If you win your matchroom you will win a reward
                            based on the room conditions you entered
                        </ul>
                        <ul>
                            As a summary you can see there is 2 distinct ways to
                            earn on Linep:
                            <ul>
                                If you are acquainted with DeFi and finance: via
                                traditional DeFi instruments such as pooling and
                                staking
                            </ul>
                            <ul>
                                If you are a gamer not blockchain native: via
                                proving your skill in different games and
                                getting a reward for victory
                            </ul>
                        </ul>
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography>How to use this demo?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <ul>
                            Connect with the wallet of your choice to the
                            protocol (reccomended Metamask)
                        </ul>
                        <ul>
                            Change the chain to SEPOLIA testnet (ETH testnet)
                        </ul>
                        <ul>Create a match room or join an open match room</ul>
                        <ul>
                            Start the match room if you created it or wait until
                            the room creator starts the match
                        </ul>
                        <ul>
                            For this demo a random winner will be selected. In
                            future demos you will play the match in the game
                            client you have chosen, and indicated in the room.
                            The winner will be sent by the game service
                            automatically.
                        </ul>
                        <ul>
                            You will recieve your prize based on the the result
                            of the room
                        </ul>
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Container>
    );
}
