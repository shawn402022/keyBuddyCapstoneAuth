import { useEffect, useState } from "react";
import { PianoProvider } from "../context/PianoContext";
import { AccidentalProvider } from "../context/AccidentalContext";

import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import RunMidiUtil from "../utils/runMidiUtil";
import AccidentalSynchronizer from "../components/AccidentalSynchronizer";


export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    RunMidiUtil.setupMidi()
  }, [])

  return (
    <>
      <AccidentalProvider>
        <PianoProvider>
          <ModalProvider>
            <Navigation />
            {isLoaded && <Outlet />}
            <Modal />
            <AccidentalSynchronizer />
          </ModalProvider>
        </PianoProvider>
      </AccidentalProvider>

    </>
  );
}
