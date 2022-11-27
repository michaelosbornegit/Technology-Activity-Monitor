# source me! using source ./script.sh
# or . ./script.sh
cd ../
python3 -m venv env
source ./env/bin/activate
python ./window-monitor.py
deactivate
