# From: https://stackoverflow.com/questions/18599339/python-watchdog-monitoring-file-for-changes
import time, crypt
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class MyHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path == "./.pipeCrypt":
            results = []
            with open("./.pipeCrypt", "r", encoding="utf-8") as file:
                for line in file.readlines():
                    group = line.split(" ")
                    if len(group) == 2:
                        results.append(crypt.crypt(group[0], group[1]))
            if results:
                with open("./.pipeCrypt", "w", encoding="utf-8") as file:
                    file.write("\n".join(results))

        # print(f'event type: {event.event_type}  path : {event.src_path}')


if __name__ == "__main__":
    event_handler = MyHandler()
    observer = Observer(timeout=0.5)
    observer.event_queue.maxsize=10
    observer.schedule(event_handler, path='./', recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()